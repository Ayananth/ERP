from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import RegisterSerializer,CompanySettingsSerializer
from .models import CompanySettings


class CompanySettingsAPIView(APIView):

    def get(self, request):

        settings = CompanySettings.objects.first()

        if not settings:
            return Response(
                {
                    "company_name": "",
                    "header_image": None,
                    "footer_image": None,
                }
            )

        serializer = CompanySettingsSerializer(settings)

        return Response(serializer.data)

    def put(self, request):

        settings = CompanySettings.objects.first()

        if settings:
            serializer = CompanySettingsSerializer(
                settings,
                data=request.data,
                partial=True,
            )
        else:
            serializer = CompanySettingsSerializer(
                data=request.data
            )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class RegisterView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )
    

class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
        })