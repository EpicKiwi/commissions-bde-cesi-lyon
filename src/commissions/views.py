from django.shortcuts import render, get_object_or_404, redirect
from commissions.models import Commission
from commissions.forms import CreateCommissionForm, EditCommissionForm, EditCommissionMembersForm
from django.contrib import messages
from commissions.models import Tag
from django.forms.models import model_to_dict

from users.models import User


def list_commissions(request):

    commissions = Commission.objects.order_by("-creation_date").order_by("-is_active")

    return render(request, "list-commissions.html", {
        "commissions": commissions,
        "active_commissions": True
    })


def view_commission(request, slug):
    com = get_object_or_404(Commission, slug=slug)

    return render(request, "view_commission.html", {
        'com': com,
        'can_manage': com.has_change_permission(request)
    })


def edit_commission(request, slug):

    if not request.user.is_authenticated:
        return redirect("/login?next={}".format(request.path))

    com = get_object_or_404(Commission, slug=slug)

    if not com.has_change_permission(request):
        messages.add_message(request, messages.ERROR, "Tu ne peux pas modifier cette commission, désolé...")
        return redirect("/commissions/{}".format(com.slug))

    edit_form = EditCommissionForm(request.POST or None, request.FILES or None, instance=com)

    # Put the queryset back on the form
    edit_form.fields["tags"].queryset = Tag.objects.all()

    if edit_form.is_valid():
        edit_form.save()
        messages.add_message(request, messages.SUCCESS, "Commission mise à jour")
        return redirect("/commissions/{}/manage".format(com.slug))

    return render(request, "edit_commission.html", {
        'com': com,
        "edit_form": edit_form,
        "active_commission_id": com.id,
        "can_change_member": com.has_change_members_permission(request)
    })


def edit_members_commission(request, slug):
    if not request.user.is_authenticated:
        return redirect("/login?next={}".format(request.path))

    com = get_object_or_404(Commission, slug=slug)

    if not com.has_change_permission(request):
        messages.add_message(request, messages.ERROR, "Tu ne peux pas modifier cette commission, désolé...")
        return redirect("/commissions/{}".format(com.slug))

    if not com.has_change_members_permission(request):
        messages.add_message(request, messages.ERROR, "Tu ne peux pas modifier les membres de cette commission, désolé...")
        return redirect("/commissions/{}/manage".format(com.slug))

    form = EditCommissionMembersForm(request.POST or None, instance=com)
    form.fields["treasurer"].queryset = User.objects.all().filter(is_active=True)
    form.fields["deputy"].queryset = User.objects.all().filter(is_active=True).exclude(id=com.president.id)
    form.fields["president"].queryset = User.objects.all().filter(is_active=True)

    if form.is_valid():
        form.save()
        messages.add_message(request, messages.SUCCESS, "Membres de la commission modifiés")
        if com.has_change_members_permission(request):
            return redirect("/commissions/{}/manage/members".format(com.slug))
        elif com.has_change_permission(request):
            return redirect("/commissions/{}/manage".format(com.slug))
        else:
            return redirect("/commissions/{}".format(com.slug))

    return render(request, "edit_members_commission.html", {
        "com": com,
        "form": form,
        "active_commission_id": com.id,
    })


def create_commission(request):

    if not request.user.is_authenticated:
        return render(request, "create_commission_unauthenticated.html",{
            "active_commission_creation": True
        })

    if not request.user.has_perm("commissions.add_commission"):
        messages.add_message(request,messages.ERROR,"Tu n'es pas autorisé à créer une commission, désolé...")
        return redirect("/")

    if request.method == "POST":
        form = CreateCommissionForm(request.POST, request.FILES)

        if form.is_valid():

            commission = Commission()

            commission.name = form.cleaned_data["name"]
            commission.short_description = form.cleaned_data["short_description"]
            commission.logo = form.cleaned_data["logo"]
            commission.banner = form.cleaned_data["banner"]
            commission.description = form.cleaned_data["description"]

            commission.save()

            commission.tags.set(form.cleaned_data["tags"])

            if form.cleaned_data["treasurer"] is not None:
                commission.treasurer = form.cleaned_data["treasurer"]
            else:
                commission.treasurer = request.user

            commission.deputy = form.cleaned_data["substitute"]

            commission.president = request.user

            commission.save()

            messages.add_message(request, messages.SUCCESS, "Youhou ! Ta commission {} à bien été crée ! Amuses toi bien".format(commission.name))

            return redirect("/commissions/{}".format(commission.slug))
        else:
            messages.add_message(request, messages.ERROR, "Tu n'as pas correctement remplis le formulaire de creation")

    else:
        form = CreateCommissionForm(initial={'treasurer': request.user})

    return render(request, "create_commission.html", {
        'form': form,
        "active_commission_creation": True
    })
