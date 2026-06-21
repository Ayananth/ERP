from django.db import models
from inventory.models import Item, Unit


class Customer(models.Model):

    customer_code = models.CharField(
        max_length=50,
        unique=True
    )

    name = models.CharField(
        max_length=255
    )

    def __str__(self):
        return f"{self.customer_code} - {self.name}"

class SalesQuotation(models.Model):

    quotation_no = models.CharField(
        max_length=50,
        unique=True
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT
    )

    quotation_date = models.DateField()

    notes = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        default="draft"
    )

    created_at = models.DateTimeField(auto_now_add=True)


class SalesQuotationLine(models.Model):

    quotation = models.ForeignKey(
        SalesQuotation,
        on_delete=models.CASCADE,
        related_name="lines"
    )

    item = models.ForeignKey(
        Item,
        on_delete=models.PROTECT
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.PROTECT
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    rate = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    vat_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
