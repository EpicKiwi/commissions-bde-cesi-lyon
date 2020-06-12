from rest_framework import parsers


class JSONFileParser(parsers.JSONParser):

    def parse(self, stream, media_type=None, parser_context=None):
        baseParsing =  super().parse(stream, media_type, parser_context)

        #if isinstance(parser_context['view'], ViewSet):


        return baseParsing