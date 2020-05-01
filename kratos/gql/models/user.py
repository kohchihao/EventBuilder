from django.contrib.auth.models import AbstractUser
from django.db import models
from gql.models.country import Country
from gql.serializers.country import CountrySerializer
from django.conf import settings
import IP2Location


class User(AbstractUser):
    email = models.EmailField(unique=True, max_length=255)
    phone_number = models.CharField(max_length=255)
    username = models.CharField(null=False, unique=True, max_length=255)
    countries = models.ManyToManyField(Country)
    name = models.CharField(blank=True, max_length=255)

    def get_user_info(self, request):
        role = self.get_user_role()
        ip = self.get_client_ip(request)
        country_code = self.get_client_country(ip)
        return role, country_code, ip

    def is_admin(self):
        return self.get_user_role() == 'Admin'

    def is_client(self):
        return self.get_user_role() == 'Client'

    def get_user_role(self):
        return 'Admin' if self.groups.all().filter(name='Admin').exists() else 'Client'

    """
    get the client ip from the request
    """
    def get_client_ip(self, request):
        PRIVATE_IPS_PREFIX = ('10.', '172.', '192.', '127.')
        # set the default value of the ip to be the REMOTE_ADDR if available
        remote_address = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR')
        ip = remote_address
        # try to get the first non-proxy ip (not a private ip) from the HTTP_X_FORWARDED_FOR
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            proxies = x_forwarded_for.split(',')
            # remove the private ips from the beginning
            while len(proxies) > 0 and proxies[0].startswith(PRIVATE_IPS_PREFIX):
                proxies.pop(0)
                # take the first ip which is not a private one (of a proxy)
                if len(proxies) > 0:
                    ip = proxies[0]
        return ip

    def get_client_country(self, ip):
        database = IP2Location.IP2Location("IP-COUNTRY.BIN")
        try:
            rec = database.get_all(ip)
        except ValueError:
            database = IP2Location.IP2Location("IPV6-COUNTRY.BIN")
            rec = database.get_all(ip)

        country_code = rec.country_short
        if not country_code:
            return settings.DEFAULT_COUNTRY

        country_code = country_code.lower()
        country = self.countries.filter(code=country_code).first()
        if not country:
            return settings.DEFAULT_COUNTRY
        return CountrySerializer(country).data.get('code')

    def __str__(self):
        return self.name + ', ' + self.email
