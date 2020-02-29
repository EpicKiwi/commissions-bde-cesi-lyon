from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from index.models import QuickLink


@registry.register_document
class QuickLinkDocument(Document):

    class Index:
        name = "quicklinks"
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = QuickLink
        fields = [
            "text",
            "url",
            "weight",
            "page"
        ]