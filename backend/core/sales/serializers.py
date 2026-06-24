from decimal import Decimal

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from inventory.models import ItemPrice
from .models import Customer, SalesOrder, SalesOrderLine, SalesQuotation, SalesQuotationLine


def validate_minimum_price(
    quantity,
    rate,
    discount_percent,
    minimum_selling_price,
):
    quantity = Decimal(quantity)
    rate = Decimal(rate)
    discount_percent = Decimal(discount_percent)
    minimum_selling_price = Decimal(minimum_selling_price)

    if quantity <= 0:
        raise ValidationError({
            "error": "Quantity must be greater than zero."
        })

    gross_amount = quantity * rate
    discount_amount = gross_amount * (discount_percent / Decimal("100"))
    net_amount = gross_amount - discount_amount
    effective_unit_price = net_amount / quantity

    if effective_unit_price < minimum_selling_price:
        raise ValidationError({
            "error": "Selling price cannot be less than the minimum selling price."
        })


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = [
            "id",
            "name"
        ]




class SalesQuotationLineSerializer(serializers.ModelSerializer):

    gross = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    net = serializers.SerializerMethodField()
    vat_amount = serializers.SerializerMethodField()
    net_after_vat = serializers.SerializerMethodField()

    class Meta:
        model = SalesQuotationLine
        fields = [
            "id",
            "item",
            "unit",
            "quantity",
            "rate",
            "discount_percent",
            "vat_percent",
            "gross",
            "discount_amount",
            "net",
            "vat_amount",
            "net_after_vat"
        ]

    def get_gross(self, obj):
        return obj.quantity * obj.rate

    def get_discount_amount(self, obj):
        return self.get_gross(obj) * obj.discount_percent / 100

    def get_net(self, obj):
        return self.get_gross(obj) - self.get_discount_amount(obj)

    def get_vat_amount(self, obj):
        return self.get_net(obj) * obj.vat_percent / 100

    def get_net_after_vat(self, obj):
        return self.get_net(obj) + self.get_vat_amount(obj)
    


class SalesQuotationCreateSerializer(serializers.Serializer):

    customer = serializers.IntegerField()
    quotation_date = serializers.DateField()
    notes = serializers.CharField(
        required=False,
        allow_blank=True
    )

    lines = SalesQuotationLineSerializer(
        many=True
    )

    def validate_lines(self, value):
        if not value:
            raise ValidationError({
                "error": "At least one quotation line is required."
            })
        return value


class SalesQuotationLineDetailSerializer(serializers.ModelSerializer):

    item_name = serializers.CharField(
        source="item.name_1",
        read_only=True
    )

    unit_name = serializers.CharField(
        source="unit.name",
        read_only=True
    )

    class Meta:
        model = SalesQuotationLine
        fields = [
            "id",
            "item",
            "item_name",
            "unit",
            "unit_name",
            "quantity",
            "rate",
            "discount_percent",
            "vat_percent",
        ]


class SalesQuotationDetailSerializer(serializers.ModelSerializer):

    lines = SalesQuotationLineDetailSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = SalesQuotation
        fields = [
            "id",
            "quotation_no",
            "customer",
            "quotation_date",
            "notes",
            "status",
            "lines",
        ]



class SalesOrderLineInputSerializer(serializers.Serializer):

    item = serializers.IntegerField()

    unit = serializers.IntegerField()

    quantity = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    rate = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    discount_percent = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    vat_percent = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

class SalesOrderCreateSerializer(serializers.Serializer):

    quotation = serializers.IntegerField(
        required=False,
        allow_null=True
    )

    customer = serializers.IntegerField()

    order_date = serializers.DateField()

    notes = serializers.CharField(
        required=False,
        allow_blank=True
    )

    lines = SalesOrderLineInputSerializer(
        many=True
    )

    def validate_customer(self, value):
        if not Customer.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Customer not found.")
        return value

    def validate_quotation(self, value):
        if value is not None and not SalesQuotation.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Quotation not found.")
        return value

    def validate_lines(self, value):
        if not value:
            raise ValidationError({
                "error": "At least one order line is required."
            })
        return value



class SalesOrderListSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )
    total_net_amount = serializers.SerializerMethodField()

    class Meta:
        model = SalesOrder

        fields = [
            "id",
            "order_no",
            "customer_name",
            "order_date",
            "status",
            "total_net_amount",
        ]

    def get_total_net_amount(self, obj):
        total = Decimal("0.00")

        for line in obj.lines.all():
            gross = line.quantity * line.rate

            discount_amount = (
                gross * line.discount_percent / Decimal("100")
            )

            net_before_vat = gross - discount_amount

            vat_amount = (
                net_before_vat * line.vat_percent / Decimal("100")
            )

            total += net_before_vat + vat_amount

        return round(total, 2)



class SalesOrderLineDetailSerializer(serializers.ModelSerializer):

    item_name = serializers.CharField(
        source="item.name_1",
        read_only=True
    )

    unit_name = serializers.CharField(
        source="unit.name",
        read_only=True
    )

    class Meta:
        model = SalesOrderLine

        fields = [
            "id",
            "item",
            "item_name",
            "unit",
            "unit_name",
            "quantity",
            "rate",
            "discount_percent",
            "vat_percent"
        ]


class SalesOrderDetailSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    quotation_no = serializers.SerializerMethodField()

    lines = SalesOrderLineDetailSerializer(
        many=True,
        read_only=True
    )

    def get_quotation_no(self, obj):
        if obj.quotation_id and obj.quotation:
            return obj.quotation.quotation_no
        return ""

    class Meta:
        model = SalesOrder

        fields = [
            "id",
            "order_no",
            "quotation",
            "quotation_no",
            "customer",
            "customer_name",
            "order_date",
            "notes",
            "status",
            "lines"
        ]
