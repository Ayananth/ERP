from rest_framework import serializers
from .models import Customer, SalesQuotationLine, SalesQuotation


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = [
            "id",
            "customer_code",
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