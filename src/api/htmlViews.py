from django.http import HttpResponse
from django.shortcuts import render

def api_docs(request):
	if not request.user.is_authenticated:
		return HttpResponse('Unauthorized', status=401)
	return render(request, "api_doc.html")