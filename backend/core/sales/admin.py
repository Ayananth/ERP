from django.contrib import admin
from .models import Customer, SalesQuotation, SalesQuotationLine, SalesOrder, SalesOrderLine

admin.site.register(Customer)
admin.site.register(SalesQuotation)
admin.site.register(SalesQuotationLine)
admin.site.register(SalesOrder)
admin.site.register(SalesOrderLine)