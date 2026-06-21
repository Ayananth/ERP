from django.contrib import admin
from .models import Item, Shelf, ItemGroup, Manufacturer, Unit, ItemUnit, ItemPrice, ItemPhoto
# Register your models here.

admin.site.register(Item)
admin.site.register(Shelf)
admin.site.register(ItemGroup)
admin.site.register(Manufacturer)
admin.site.register(ItemUnit)
admin.site.register(ItemPrice)
admin.site.register(ItemPhoto)
@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ("code", "name")