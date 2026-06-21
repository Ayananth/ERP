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

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        APPROVED = "approved", "Approved"
        CONVERTED = "converted", "Converted"
        CANCELLED = "cancelled", "Cancelled"

    quotation_no = models.CharField(
        max_length=50,
        unique=True,
        blank=True
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name="quotations"
    )

    quotation_date = models.DateField()

    notes = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        super().save(*args, **kwargs)

        if is_new and not self.quotation_no:
            self.quotation_no = f"SQ-{self.pk:05d}"
            super().save(update_fields=["quotation_no"])

    def __str__(self):
        return self.quotation_no

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

    def __str__(self):
        return f"{self.quotation.quotation_no}"