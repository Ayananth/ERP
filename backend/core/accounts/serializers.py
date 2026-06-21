import re
from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "password",
        ]

    def validate_username(self, value):

        value = value.strip()

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Username already exists."
            )

        if not re.match(r"^[A-Za-z][A-Za-z0-9_]*$", value):
            raise serializers.ValidationError(
                "Username must start with a letter and contain only letters, numbers, and underscores."
            )

        return value

    def validate_password(self, value):

        if len(value) < 6:
            raise serializers.ValidationError(
                "Password must be at least 6 characters long."
            )
        return value

    def create(self, validated_data):

        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user