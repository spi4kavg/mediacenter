from __future__ import unicode_literals

from django.db import models


class ApartmentComplex(models.Model):

    name = models.CharField(max_length=200, unique=True)
    city = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    house = models.CharField(max_length=10)
    structure = models.CharField(max_length=10, blank=True, null=True)
    site = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)

    def __unicode__(self):
        return u"%s" % (self.__str__())

    def __str__(self):
        return self.name


class Flat(models.Model):
    apartment = models.ForeignKey(ApartmentComplex)
    building_section = models.IntegerField()
    building_phase = models.IntegerField()
    floor = models.IntegerField()
    on_floor_number = models.IntegerField()
    space = models.DecimalField(max_digits=9, decimal_places=2)
    price = models.IntegerField()
    balcony = models.BooleanField()

    def __unicode__(self):
        return u"%s" % (self.__str__())

    def __str__(self):
        return self.name
