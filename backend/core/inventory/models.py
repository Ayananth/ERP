from django.db import models

class Item(models.Model):

    class Behaviour(models.TextChoices):
        PURCHASE = "purchase", "Purchase Item"
        SALES = "sales", "Sales Item"
        BOTH = "both", "Purchase & Sales Item"
        SERVICE = "service", "Service Item"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"

    class TaxableStatus(models.TextChoices):
        TAXABLE = "taxable", "Taxable"
        NON_TAXABLE = "non_taxable", "Non-Taxable"

    item_code = models.CharField(max_length=50, unique=True, blank=True)

    name_1 = models.CharField(max_length=255)
    name_2 = models.CharField(max_length=255, blank=True)

    generic_name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    behaviour = models.CharField(
        max_length=20,
        choices=Behaviour.choices,
        default=Behaviour.BOTH
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )

    taxable_status = models.CharField(
        max_length=20,
        choices=TaxableStatus.choices,
        default=TaxableStatus.NON_TAXABLE
    )

    group = models.ForeignKey(
        "ItemGroup",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    manufacturer = models.ForeignKey(
        "Manufacturer",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    shelf = models.ForeignKey(
        "Shelf",
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def save(self, *args, **kwargs):
        is_new = self.pk is None

        super().save(*args, **kwargs)

        if is_new and not self.item_code:
            self.item_code = f"ITM-{self.pk:05d}"
            Item.objects.filter(pk=self.pk).update(
                item_code=self.item_code
            )


class Shelf(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name



class ItemGroup(models.Model):
    name = models.CharField(max_length=100)


class Manufacturer(models.Model):
    name = models.CharField(max_length=255)



class Unit(models.Model):
    code = models.CharField(
        max_length=20,
        unique=True
    )

    name = models.CharField(max_length=100)


class ItemUnit(models.Model):

    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name="units"
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.CASCADE
    )

    conversion_factor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1
    )

    barcode = models.CharField(
        max_length=100,
        blank=True
    )

    is_stock_unit = models.BooleanField(
        default=False
    )

    is_sales_unit = models.BooleanField(
        default=False
    )


class ItemPrice(models.Model):

    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name="prices"
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.CASCADE
    )

    sale_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    minimum_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )


class ItemPhoto(models.Model):

    item = models.OneToOneField(
        Item,
        on_delete=models.CASCADE,
        related_name="photo"
    )

    image = models.ImageField(
        upload_to="items/"
    )