from rest_framework import serializers
from .models import Item


class ItemCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = "__all__"

    def validate_name_1(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Name 1 is required."
            )
        return value
    
    def validate_item_code(self, value):
        if value and Item.objects.filter(item_code=value).exists():
            raise serializers.ValidationError(
                "Item code already exists."
            )
        return value