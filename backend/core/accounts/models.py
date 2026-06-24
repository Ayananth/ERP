from django.db import models

class CompanySettings(models.Model):

    company_name = models.CharField(
        max_length=255,
        default="Exalore ERP"
    )

    header_image = models.ImageField(
        upload_to="company/header/",
        null=True,
        blank=True
    )

    footer_image = models.ImageField(
        upload_to="company/footer/",
        null=True,
        blank=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.company_name
