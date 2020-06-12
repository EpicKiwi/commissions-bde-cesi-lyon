from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from commissions.models import Commission, Event


@registry.register_document
class CommissionDocument(Document):

    tags = fields.KeywordField(attr='get_tags_names')

    class Index:
        name = "commissions"
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Commission
        fields = [
            'is_active',
            'name',
            'short_description',
            'description',
            'creation_date',
            'organization_dependant',
            'is_organization'
        ]


@registry.register_document
class EventDocument(Document):

    commission = fields.TextField(attr='get_commission_name')

    class Index:
        name = "events"
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Event
        fields = [
            'name',
            'description',
            'location',
            'event_date_start',
            'event_date_end'
        ]