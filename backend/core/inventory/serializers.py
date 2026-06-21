from rest_framework import serializers
from .models import Item, ItemUnit, Shelf, ItemGroup, Manufacturer, Unit


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
    

class ItemUnitSerializer(serializers.ModelSerializer):

    unit_name = serializers.CharField(
        source="unit.name",
        read_only=True
    )

    class Meta:
        model = ItemUnit
        fields = [
            "id",
            "unit",
            "unit_name",
            "conversion_factor",
            "barcode",
        ]


class ItemUnitCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemUnit
        fields = [
            "unit",
            "conversion_factor",
            "barcode",
        ]

    def validate(self, attrs):

        item = self.context["item"]
        unit = attrs["unit"]

        if ItemUnit.objects.filter(
            item=item,
            unit=unit
        ).exists():
            raise serializers.ValidationError(
                "Unit already exists for this item."
            )

        return attrs
    

class ItemUnitSettingsSerializer(serializers.Serializer):

    stock_unit = serializers.IntegerField()
    sales_unit = serializers.IntegerField()