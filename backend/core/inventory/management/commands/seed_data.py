from django.core.management.base import BaseCommand

from inventory.models import (
    Shelf,
    Manufacturer,
    ItemGroup,
    Unit,
)

from sales.models import Customer


class Command(BaseCommand):
    help = "Seed initial ERP master data"

    def handle(self, *args, **options):

        shelves = [
            "A1",
            "A2",
            "B1",
            "B2",
            "Warehouse",
        ]

        manufacturers = [
            "Apple",
            "Samsung",
            "Sony",
            "LG",
            "Dell",

        ]

        item_groups = [
            "Electronics",
            "Mobile",
            "Laptop",
            "Accessories",
            "Services",
        ]

        units = [
            ("PCS", "Pieces"),
            ("BOX", "Box"),
            ("KG", "Kilogram"),
            ("LTR", "Litre"),
            ("PACK", "Pack"),
            ("CARTONE", "cartone"),

        ]

        customers = [
            ("CUS-001", "ABC Traders"),
            ("CUS-002", "Global Stores"),
            ("CUS-003", "Tech World"),
            ("CUS-004", "Retail Hub"),
            ("CUS-005", "Demo Customer"),
        ]

        for shelf in shelves:
            Shelf.objects.get_or_create(name=shelf)

        for manufacturer in manufacturers:
            Manufacturer.objects.get_or_create(name=manufacturer)

        for group in item_groups:
            ItemGroup.objects.get_or_create(name=group)

        for code, name in units:
            Unit.objects.get_or_create(
                code=code,
                defaults={"name": name},
            )

        for code, name in customers:
            Customer.objects.get_or_create(
                customer_code=code,
                defaults={"name": name},
            )

        self.stdout.write(
            self.style.SUCCESS("Seed data loaded successfully.")
        )