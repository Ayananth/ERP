from rest_framework import serializers
from .models import Item, ItemPhoto, ItemUnit, Shelf, ItemGroup, Manufacturer, Unit, ItemPrice


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


class ItemDropdownSerializer(serializers.ModelSerializer):

    name = serializers.CharField(
        source="name_1",
        read_only=True
    )

    class Meta:
        model = Item
        fields = [
            "id",
            "item_code",
            "name",
        ]


class ItemUnitChoiceSerializer(serializers.Serializer):
    unit_id = serializers.IntegerField()
    unit_name = serializers.CharField()


class ItemPriceChoiceSerializer(serializers.Serializer):
    unit_id = serializers.IntegerField()
    sale_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )


class ItemDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    item_code = serializers.CharField()
    name = serializers.CharField()
    name_1 = serializers.CharField()
    name_2 = serializers.CharField(allow_blank=True, required=False)
    generic_name = serializers.CharField(allow_blank=True, required=False)
    description = serializers.CharField(allow_blank=True, required=False)
    behaviour = serializers.CharField()
    status = serializers.CharField()
    taxable_status = serializers.CharField()
    group = serializers.IntegerField(allow_null=True, required=False)
    group_name = serializers.CharField(allow_blank=True, required=False)
    manufacturer = serializers.IntegerField(allow_null=True, required=False)
    manufacturer_name = serializers.CharField(allow_blank=True, required=False)
    shelf = serializers.IntegerField(allow_null=True, required=False)
    shelf_name = serializers.CharField(allow_blank=True, required=False)
    units = ItemUnitChoiceSerializer(many=True)
    prices = ItemPriceChoiceSerializer(many=True)
    

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


class ItemPhotoSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ItemPhoto
        fields = [
            "id",
            "item",
            "image",
            "image_url"
        ]
        read_only_fields = ["item"]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)

        return None
    


class ItemPriceRowSerializer(serializers.Serializer):
    unit_id = serializers.IntegerField()
    unit_code = serializers.CharField()

    sale_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        allow_null=True
    )

    minimum_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        allow_null=True
    )


class ItemPriceListSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    item_code = serializers.CharField()
    item_name = serializers.CharField()

    prices = ItemPriceRowSerializer(
        many=True
    )


class ItemPriceSaveRowSerializer(serializers.Serializer):
    unit_id = serializers.IntegerField()

    sale_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=0.01
    )

    minimum_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=0.01
    )

    def validate(self, attrs):

        sale_price = attrs["sale_price"]
        minimum_price = attrs["minimum_price"]

        if minimum_price > sale_price:
            raise serializers.ValidationError(
                "Minimum selling price cannot be greater than sale price."
            )
        if minimum_price < 0:
            raise serializers.ValidationError(
                "Minimum selling price cannot be greater than sale price."
            )

        return attrs


class ItemPriceSaveSerializer(serializers.Serializer):
    prices = ItemPriceSaveRowSerializer(
        many=True
    )
