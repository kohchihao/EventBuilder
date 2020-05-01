from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from gql.utils.google_cloud import upload_file
from gql.utils.random import pk_gen
from rest_framework import views
from rest_framework.parsers import MultiPartParser


class FileUploadView(views.APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        if 'file' in data:
            image = data['file']
            url = upload_file(image, filename=pk_gen(), content_type=image.content_type)
            return Response({"url": url}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
