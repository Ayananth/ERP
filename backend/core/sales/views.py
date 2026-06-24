from decimal import Decimal

from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from weasyprint import CSS, HTML


from .serializers import (
    SalesQuotationCreateSerializer,
    SalesQuotationDetailSerializer,
    SalesQuotationPdfSerializer,
    CustomerSerializer,
    SalesOrderListSerializer,
    SalesOrderCreateSerializer,
    SalesOrderDetailSerializer,
    SalesOrderPdfSerializer,
)

from .models import (
    Customer,
    SalesOrder,
    SalesOrderLine,
    SalesQuotation,
    SalesQuotationLine,
)

from django.shortcuts import get_object_or_404


def save_order_lines(order, lines):
    for line in lines:
        order_line = SalesOrderLine(
            order=order,
            item_id=line["item"],
            unit_id=line["unit"],
            quantity=line["quantity"],
            rate=line["rate"],
            discount_percent=line["discount_percent"],
            vat_percent=line["vat_percent"],
        )
        order_line.save()


class CustomerListView(APIView):

    def get(self, request):

        customers = Customer.objects.all()

        serializer = CustomerSerializer(
            customers,
            many=True
        )

        return Response(serializer.data)
    

class SalesQuotationCreateView(APIView):

    def post(self, request):

        serializer = SalesQuotationCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        quotation = SalesQuotation.objects.create(
            customer_id=data["customer"],
            quotation_date=data["quotation_date"],
            notes=data.get("notes", "")
        )

        for line in data["lines"]:

            quotation_line = SalesQuotationLine(
                quotation=quotation,
                item_id=line["item"],
                unit_id=line["unit"],
                quantity=line["quantity"],
                rate=line["rate"],
                discount_percent=line["discount_percent"],
                vat_percent=line["vat_percent"]
            )
            quotation_line.save()

        return Response(
            {"id": quotation.id}
        )
    

class SalesQuotationListView(APIView):

    def get(self, request):

        quotations = (
            SalesQuotation.objects
            .select_related("customer")
            .order_by("-id")
        )

        data = []

        for quotation in quotations:
            data.append({
                "id": quotation.id,
                "quotation_no": quotation.quotation_no,
                "customer": quotation.customer.name,
                "quotation_date": quotation.quotation_date,
                "status": quotation.status,
                "net": quotation.total_net_amount,
            })

        return Response(data)
    



class SalesQuotationDetailView(APIView):

    def get_object(self, pk):
        return get_object_or_404(
            SalesQuotation.objects.select_related("customer").prefetch_related("lines"),
            pk=pk
        )

    def get(self, request, pk):
        quotation = self.get_object(pk)
        serializer = SalesQuotationDetailSerializer(quotation)
        return Response(serializer.data)

    def put(self, request, pk):
        quotation = self.get_object(pk)

        serializer = SalesQuotationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        quotation.customer_id = data["customer"]
        quotation.quotation_date = data["quotation_date"]
        quotation.notes = data.get("notes", "")
        quotation.save()

        quotation.lines.all().delete()

        for line in data["lines"]:
            quotation_line = SalesQuotationLine(
                quotation=quotation,
                item_id=line["item"],
                unit_id=line["unit"],
                quantity=line["quantity"],
                rate=line["rate"],
                discount_percent=line["discount_percent"],
                vat_percent=line["vat_percent"],
            )
            quotation_line.save()

        return Response({"id": quotation.id})

    def delete(self, request, pk):
        quotation = get_object_or_404(SalesQuotation, pk=pk)
        quotation.delete()
        return Response({"message": "Quotation deleted"})


class SalesQuotationPdfView(APIView):

    def get_object(self, pk):
        return get_object_or_404(
            SalesQuotation.objects.select_related("customer").prefetch_related(
                "lines__item",
                "lines__unit",
            ),
            pk=pk
        )

    def get(self, request, pk):
        quotation = self.get_object(pk)
        lines = []

        for line in quotation.lines.all():
            gross = line.quantity * line.rate
            discount = gross * line.discount_percent / Decimal("100")
            net = gross - discount
            vat = net * line.vat_percent / Decimal("100")
            total = net + vat

            lines.append({
                "item_name": line.item.name_1,
                "unit_name": line.unit.name,
                "quantity": line.quantity,
                "rate": line.rate,
                "discount": discount,
                "vat": vat,
                "total": total,
            })

        pdf_data = SalesQuotationPdfSerializer({
            "company_name": "Exalore ERP",
            "quotation_number": quotation.quotation_no,
            "quotation_date": quotation.quotation_date,
            "customer_name": quotation.customer.name,
            "notes": quotation.notes or "",
            "lines": lines,
            "grand_total": quotation.total_net_amount,
        }).data

        html = render_to_string("sales/quotation_invoice.html", pdf_data)
        css_path = settings.BASE_DIR / "sales" / "static" / "sales" / "invoice.css"

        pdf = HTML(string=html, base_url=request.build_absolute_uri("/")).write_pdf(
            stylesheets=[CSS(filename=str(css_path))]
        )

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = (
            f'inline; filename="{quotation.quotation_no}.pdf"'
        )
        response["X-Filename"] = f"SalesQuotation_{quotation.quotation_no}.pdf"
        response["Access-Control-Expose-Headers"] = "X-Filename"
        return response
    



class SalesOrderListView(APIView):

    def get(self, request):

        queryset = (
            SalesOrder.objects
            .select_related("customer")
            .order_by("-id")
        )

        serializer = SalesOrderListSerializer(
            queryset,
            many=True
        )

        return Response(serializer.data)


class SalesOrderCreateView(APIView):

    def post(self, request):

        serializer = SalesOrderCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        order = SalesOrder.objects.create(
            quotation_id=data.get("quotation"),
            customer_id=data["customer"],
            order_date=data["order_date"],
            notes=data.get("notes", "")
        )

        save_order_lines(order, data["lines"])

        return Response(
            {
                "id": order.id,
                "order_no": order.order_no
            },
            status=status.HTTP_201_CREATED
        )


class SalesOrderDetailAPIView(APIView):

    def get_object(self, pk):

        return get_object_or_404(
            SalesOrder.objects.select_related(
                "customer",
                "quotation"
            ).prefetch_related(
                "lines__item",
                "lines__unit",
            ),
            pk=pk
        )

    def get(self, request, pk):

        order = self.get_object(pk)

        serializer = SalesOrderDetailSerializer(order)

        return Response(serializer.data)

    def put(self, request, pk):

        order = self.get_object(pk)

        serializer = SalesOrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        order.quotation_id = data.get("quotation")
        order.customer_id = data["customer"]
        order.order_date = data["order_date"]
        order.notes = data.get("notes", "")
        order.save()

        order.lines.all().delete()
        save_order_lines(order, data["lines"])

        return Response(
            {
                "id": order.id,
                "order_no": order.order_no
            }
        )

    def delete(self, request, pk):

        order = self.get_object(pk)
        order.delete()

        return Response({"message": "Sales order deleted"})


class SalesOrderPdfView(APIView):

    def get_object(self, pk):
        return get_object_or_404(
            SalesOrder.objects.select_related(
                "customer",
                "quotation"
            ).prefetch_related(
                "lines__item",
                "lines__unit",
            ),
            pk=pk
        )

    def get(self, request, pk):
        order = self.get_object(pk)
        lines = []
        for line in order.lines.all():
            line_total = (line.quantity * line.rate).quantize(Decimal("0.01"))
            lines.append(
                {
                    "item_name": line.item.name_1,
                    "unit_name": line.unit.name,
                    "quantity": line.quantity,
                    "rate": line.rate,
                    "total": line_total,
                }
            )

        pdf_data = SalesOrderPdfSerializer(
            {
                "company_name": "Exalore ERP",
                "invoice_number": order.order_no,
                "invoice_date": order.order_date,
                "customer_name": order.customer.name,
                "lines": lines,
                "grand_total": order.total_net_amount,
            }
        ).data

        html = render_to_string("sales/invoice.html", pdf_data)
        css_path = settings.BASE_DIR / "sales" / "static" / "sales" / "invoice.css"

        pdf = HTML(string=html, base_url=request.build_absolute_uri("/")).write_pdf(
            stylesheets=[CSS(filename=str(css_path))]
        )

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'inline; filename="{order.order_no}.pdf"'
        response["X-Filename"] = f"SalesOrder_{order.order_no}.pdf"
        response["Access-Control-Expose-Headers"] = "X-Filename"
        return response
