from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions, DjangoObjectPermissions
from rest_framework.relations import HyperlinkedRelatedField
from rest_framework.response import Response
from url_filter.integrations.drf import DjangoFilterBackend

from api.serializers import UserSerializer, CommissionSerializer, PostSerializer, SocialQuesterSerializer, \
	PostImageSerializer, UploadSerializer, UploadCreateSerializer
from commissions.models import Commission, Post, CommissionSocialQuester, PostImage
from documents.models import Upload
from users.models import User


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [IsAuthenticated, DjangoModelPermissions, DjangoObjectPermissions]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
			"id",
			"email",
			"support_member"
		]


class CommissionViewSet(viewsets.ModelViewSet):
	queryset = Commission.objects.all()
	serializer_class = CommissionSerializer
	permission_classes = [IsAuthenticated, DjangoModelPermissions, DjangoObjectPermissions]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
			"id",
			"is_active",
			"name",
			"slug",
			"short_description",
			"description",
			"president",
			"treasurer",
			"deputy",
			"creation_date",
			"end_date",
			"organization_dependant",
			"social_questers",
			"is_organization"
		]



class PostViewSet(viewsets.ModelViewSet):
	queryset = Post.objects.all()
	serializer_class = PostSerializer
	permission_classes = [IsAuthenticated, DjangoModelPermissions, DjangoObjectPermissions]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
			"id",
			"content",
			"source",
			"external_id",
			"author",
			"author_text",
			"commission",
			"date",
			"is_moderated"
		]


class SocialQuesterViewSet(viewsets.ModelViewSet):
	queryset = CommissionSocialQuester.objects.all()
	serializer_class = SocialQuesterSerializer
	permission_classes = [IsAuthenticated, DjangoModelPermissions, DjangoObjectPermissions]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
			"id",
			"commission",
			"query",
			"since_date"
		]


class PostImagesViewSet(viewsets.ModelViewSet):
	queryset = PostImage.objects.all()
	serializer_class = PostImageSerializer
	permission_classes = [IsAuthenticated, DjangoModelPermissions, DjangoObjectPermissions]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
		"id",
		"post"
	]


class UploadViewSet(viewsets.ModelViewSet):
	queryset = Upload.objects.all()
	serializer_class = UploadSerializer
	permission_classes = [IsAuthenticated, DjangoModelPermissions, DjangoObjectPermissions]

	def create(self, request, *args, **kwargs):
		serializer = UploadCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		instance = serializer.save(created_by=request.user)

		full_serializer = self.get_serializer(instance)
		headers = self.get_success_headers(full_serializer.data)
		return Response(full_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

