from elasticsearch_dsl import Document, Text
from django_elasticsearch_dsl.registries import registry


class DocumentationDocument(Document):

    title = Text()
    content = Text()
    url = Text()

    class Index:
        name = "documentations"
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }