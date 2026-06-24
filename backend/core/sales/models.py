from decimal import Decimal

from django.core.exceptions import ValidationError
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

    @property
    def total_net_amount(self):
        total = Decimal("0.00")

        for line in self.lines.all():
            gross = line.quantity * line.rate
            discount = gross * line.discount_percent / Decimal("100")
            net = gross - discount
            vat = net * line.vat_percent / Decimal("100")

            total += net + vat

        return total

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

    def clean(self):
        errors = {}

        if self.quantity is None or self.quantity <= 0:
            errors["quantity"] = "Quantity must be greater than zero."
        if self.rate is None or self.rate < 0:
            errors["rate"] = "Rate cannot be negative."
        if self.discount_percent is None or self.discount_percent < 0 or self.discount_percent > 100:
            errors["discount_percent"] = "Discount percentage must be between 0 and 100."
        if self.vat_percent is None or self.vat_percent < 0 or self.vat_percent > 100:
            errors["vat_percent"] = "VAT percentage must be between 0 and 100."

        if errors:
            raise ValidationError(errors)
    



class SalesOrder(models.Model):

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"

    order_no = models.CharField(
        max_length=50,
        unique=True,
        blank=True
    )

    quotation = models.ForeignKey(
        "SalesQuotation",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="orders"
    )

    customer = models.ForeignKey(
        "Customer",
        on_delete=models.PROTECT,
        related_name="orders"
    )

    order_date = models.DateField()

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

    @property
    def total_net_amount(self):
        total = Decimal("0.00")

        for line in self.lines.all():
            gross = line.quantity * line.rate

            discount = (
                gross * line.discount_percent / Decimal("100")
            )

            net = gross - discount

            vat = (
                net * line.vat_percent / Decimal("100")
            )

            total += net + vat

        return total

    def save(self, *args, **kwargs):

        is_new = self.pk is None

        super().save(*args, **kwargs)

        if is_new and not self.order_no:
            self.order_no = f"SO-{self.pk:05d}"
            super().save(update_fields=["order_no"])

    def __str__(self):
        return self.order_no
    


class SalesOrderLine(models.Model):

    order = models.ForeignKey(
        SalesOrder,
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
        return f"{self.order.order_no}"

    def clean(self):
        errors = {}

        if self.quantity is None or self.quantity <= 0:
            errors["quantity"] = "Quantity must be greater than zero."
        if self.rate is None or self.rate < 0:
            errors["rate"] = "Rate cannot be negative."
        if self.discount_percent is None or self.discount_percent < 0 or self.discount_percent > 100:
            errors["discount_percent"] = "Discount percentage must be between 0 and 100."
        if self.vat_percent is None or self.vat_percent < 0 or self.vat_percent > 100:
            errors["vat_percent"] = "VAT percentage must be between 0 and 100."

        if errors:
            raise ValidationError(errors)
