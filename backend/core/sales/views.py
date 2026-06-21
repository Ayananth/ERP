from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import SalesQuotationCreateSerializer, CustomerSerializer

from .models import Customer, SalesQuotation, SalesQuotationLine

from django.shortcuts import get_object_or_404


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

            SalesQuotationLine.objects.create(
                quotation=quotation,
                item_id=line["item"].id,
                unit_id=line["unit"].id,
                quantity=line["quantity"],
                rate=line["rate"],
                discount_percent=line["discount_percent"],
                vat_percent=line["vat_percent"]
            )

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
                "status": quotation.status
            })

        return Response(data)
    



# class SalesQuotationDetailView(APIView):

#     def get(self, request, pk):

#         quotation = get_object_or_404(
#             SalesQuotation,
#             pk=pk
#         )

#         serializer = SalesQuotationDetailSerializer(
#             quotation
#         )

#         return Response(serializer.data)

class SalesQuotationUpdateView(APIView):

    def put(self, request, pk):

        quotation = get_object_or_404(
            SalesQuotation,
            pk=pk
        )

        serializer = SalesQuotationCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        quotation.customer_id = data["customer"]
        quotation.quotation_date = data["quotation_date"]
        quotation.notes = data.get("notes", "")
        quotation.save()

        quotation.lines.all().delete()

        for line in data["lines"]:

            SalesQuotationLine.objects.create(
                quotation=quotation,
                item_id=line["item"].id,
                unit_id=line["unit"].id,
                quantity=line["quantity"],
                rate=line["rate"],
                discount_percent=line["discount_percent"],
                vat_percent=line["vat_percent"]
            )

        return Response(
            {"message": "Updated"}
        )