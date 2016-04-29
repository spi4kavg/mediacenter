# -*- coding: utf-8 -*-
import datetime
import xml.etree.ElementTree as ET
import xlrd
import cStringIO
from django.http import Http404, HttpResponse
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers.apartment_complex import ApartmentComplexSerializer
from api.models import ApartmentComplex, Flat


class ApartmentComplexList(generics.ListCreateAPIView):
    page_size = 10
    queryset = ApartmentComplex.objects.all()
    serializer_class = ApartmentComplexSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.POST)
        if serializer.is_valid():
            serializer.create(serializer.validated_data)
            return Response({}, status=201)
        return Response({
            "errors": serializer.errors
        })


class ApartmentComplexDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ApartmentComplexSerializer
    queryset = ApartmentComplex.objects.all()


@api_view(['POST'])
def file_import(request, pk):
    """ import excel file """
    file = request.FILES.get("file")
    try:
        ap_comp = ApartmentComplex.objects.get(pk=pk)
    except ApartmentComplex.DoesNotExist:
        raise Http404
    # checks if excel
    if file.name.split(".")[-1] in ["xlsx", "xls"]:
        # opens and gets first list
        book = xlrd.open_workbook(file_contents=file.read())
        sheet = book.sheet_by_index(0)
        # removes old flats
        Flat.objects.filter(apartment=ap_comp).delete()
        # creates new
        for rownum in range(1, sheet.nrows):
            values = sheet.row_values(rownum)
            flats = Flat.objects.create(
                apartment=ap_comp,
                building_section=values[0],
                building_phase=values[1],
                floor=values[2],
                on_floor_number=values[3],
                space=values[4],
                price=values[5],
                balcony=values[6]
            )
        return Response({
            "loaded_count": Flat.objects.filter(apartment=ap_comp).count()
        })

    else:
        return Respose({
            "error": u"Неверный формат файла"
        })


@api_view(['GET'])
def file_export(request, pk):
    """ import xml """
    try:
        ap_comp = ApartmentComplex.objects.get(pk=pk)
    except ApartmentComplex.DoesNotExist:
        raise Http404
    # gets flats
    flats = Flat.objects.filter(apartment=ap_comp)
    # generates root eleent
    root = ET.Element("reality-feed", attrib={
        "xmlns": "http://webmaster.yandex.ru/schemas/feed/realty/2010-06"
    })
    generation_data = ET.SubElement(root, "generation-date")
    # generates flats elements
    for flat in flats:

        offer = ET.SubElement(root, "offer", attrib={
            "internal-id": unicode(ap_comp.pk)
        })

        type_ = ET.SubElement(offer, "type")
        type_.text = u"продажа"

        type_ = ET.SubElement(offer, "type")
        type_.text = u"продажа"

        property_type = ET.SubElement(offer, "property_type")
        property_type.text = u"жилая"

        category = ET.SubElement(offer, "category")
        category.text = u"flat"

        url = ET.SubElement(offer, "url")
        url.text = ap_comp.site

        locality_name = ET.SubElement(offer, "locality-name")
        locality_name.text = ap_comp.city

        adress = ET.SubElement(offer, "adress")
        adress.text = u",".join([
            ap_comp.street,
            ap_comp.house,
            ap_comp.structure
        ])

        building_section = ET.SubElement(offer, 'building-section')
        building_section.text = unicode(flat.building_section)

        building_phase = ET.SubElement(offer, 'building-phase')
        building_phase.text = unicode(flat.building_phase)

        floor = ET.SubElement(offer, "floor")
        floor.text = unicode(flat.floor)

        on_floor_num = ET.SubElement(offer, "on-floor-number")
        on_floor_num.text = unicode(flat.on_floor_number)

        space = ET.SubElement(offer, "space")
        space.text = unicode(flat.space)

        price = ET.SubElement(offer, "price")
        price.text = unicode(flat.price)

        balcony = ET.SubElement(offer, "balcony")
        balcony.text = u"Да" if flat.balcony else u"Нет"

    file = cStringIO.StringIO(ET.tostring(root))
    response = HttpResponse(file, content_type="application/xml")
    response['Content-Disposition'] = 'attachment; filename="export.xml"'
    return response
