from rest_framework import routers
from django.urls import path
from rest_framework.schemas import get_schema_view
import os.path as pth

from api.htmlViews import api_docs
from api.views import UserViewSet, PostViewSet, CommissionViewSet, SocialQuesterViewSet, PostImagesViewSet, \
	UploadViewSet, MixedSearch, EventViewSet, DocumentViewSet

# API URLs
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'commissions', CommissionViewSet)
router.register(r'posts', PostViewSet)
router.register(r'social-questers', SocialQuesterViewSet)
router.register(r'post-images', PostImagesViewSet)
router.register(r'uploads', UploadViewSet)
router.register(r'events', EventViewSet)
router.register(r'documents', DocumentViewSet)

with open(pth.dirname(__file__)+"/docIntroduction.md", "r") as f:
	API_DESCRIPTION = f.read()

# Standard django URLs
urlpatterns = [

	path("openapi.yaml", get_schema_view(
		title="BDE CESI Lyon API",
		description=API_DESCRIPTION
	), name="api_docs_schema"),

	path("_docs", api_docs, name="api_docs"),

	path("search", MixedSearch.as_view(), name="mixed_search"),

]
