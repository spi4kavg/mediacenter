from rest_framework import serializers
from api.models import ApartmentComplex, Flat


class ApartmentComplexSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=200, min_length=3)
    city = serializers.CharField(max_length=100, min_length=3)
    street = serializers.CharField(max_length=100, min_length=3)
    house = serializers.CharField(max_length=10, min_length=1)
    site = serializers.URLField(allow_blank=True)
    email = serializers.EmailField(allow_blank=True)
    count = serializers.SerializerMethodField()

    class Meta:
        model = ApartmentComplex

    def get_count(self, obj):
        return Flat.objects.filter(apartment=obj).count()

    def create(self, validated_data):
        return ApartmentComplex.objects.create(**validated_data)
