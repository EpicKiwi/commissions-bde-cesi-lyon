from django.contrib.auth.models import Group
from django.urls import reverse
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from commissions.models import Post, Commission, CommissionSocialQuester, PostImage, Event
from documents.models import Upload
from index.models import QuickLink
from users.models import User


class PostSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Post
		fields = [
			"url",
			"id",
			"content",
			"source",
			"external_id",
			"author",
			"author_text",
			"author_image",
			"commission",
			"date",
			"is_moderated",
			"images"
		]


class PostImageSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = PostImage
		fields = [
			"url",
			"id",
			"post",
			"image"
		]


class CommissionSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Commission
		fields = [
			"url",
			"id",
			"is_active",
			"name",
			"slug",
			"short_description",
			"description",
			"logo",
			"banner",
			"president",
			"treasurer",
			"deputy",
			"creation_date",
			"end_date",
			"organization_dependant",
			"social_questers",
			"is_organization"
		]


class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = [
			"url",
			"id",
			"email",
			"profile_picture",
			"is_active",
			"support_member",
			"is_viacesi"
		]


class ExtendedUserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = [
			"url",
			"id",
			"email",
			"first_name",
			"last_name",
			"profile_picture",
			"is_active",
			"support_member",
			"is_viacesi"
		]


class SocialQuesterSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = CommissionSocialQuester
		fields = [
			"url",
			"id",
			"commission",
			"query",
			"since_date",
			"commission_id"
		]


class UploadSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Upload
		fields = [
			"url",
			"id",
			"created_at",
			"file",
			"created_by"
		]


class UploadCreateSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Upload
		fields = [
			"file"
		]


class EventSerializer(serializers.HyperlinkedModelSerializer):

	commission = CommissionSerializer()

	class Meta:
		model = Event
		fields = [
			"url",
			"id",
			"name",
			"slug",
			"description",
			"location",
			"banner",
			"commission",
			"creation_date",
			"update_date",
			"event_date_start",
			"event_date_end"
		]


class QuicklinkSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = QuickLink
		fields = [
			"url",
			"id",
			"text",
			"weight",
			"style",
			"icon",
			"page"
		]


class DocumentationSerializer(serializers.Serializer):
	title = serializers.CharField()
	content = serializers.CharField()
	path = serializers.CharField()
	url = serializers.SerializerMethodField('get_url_fields')

	def get_url_fields(self, obj):
		return reverse("guide_subdocument", kwargs={"path": obj.path})


class MixedSearchSerializer(serializers.Serializer):
	documentations = serializers.ListField(
		child=DocumentationSerializer()
	)
	commissions = serializers.ListField(
		child=CommissionSerializer()
	)
	users = serializers.ListField(
		child=ExtendedUserSerializer()
	)
	events = serializers.ListField(
		child=EventSerializer()
	)
	quicklinks = serializers.ListField(
		child=QuicklinkSerializer()
	)