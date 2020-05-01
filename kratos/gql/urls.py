from django.urls import include, path
from rest_framework import routers
from gql.views import event, auth, country, service_type, event_type, service, curated_event, provider, user, \
    upload

router = routers.DefaultRouter()
router.register(r'events', event.EventViewSet, basename='event')
router.register('auth', auth.AuthViewSet, basename='auth')
router.register('countries', country.CountryViewSet, basename='country')
router.register('service_types', service_type.ServiceTypeViewSet, basename='service_type')
router.register('event_types', event_type.EventTypeViewSet, basename='event_type')
router.register('services', service.ServiceViewSet, basename='service')
router.register('curated_events', curated_event.CuratedEventViewSet, basename='curated_event')
router.register('providers', provider.ProviderViewSet, basename='provider')
router.register('users', user.UserViewSet, basename='user')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('events/with_status/<slug:status>/', event.EventViewSet.list_with_status, name='event_list_with_status'),

    # Auth
    path('auth/register/', auth.AuthViewSet.register, name='register'),
    path('auth/register_with_event_details/', auth.AuthViewSet.register_with_event_details,
         name='register_with_event_details'),

    # Event
    path('events/contact/<slug:event_id>/', event.EventViewSet.contact, name='event_contact'),
    path('events/quote/<slug:event_id>/', event.EventViewSet.quote, name='event_quote'),
    path('events/accept/<slug:event_id>/', event.EventViewSet.accept, name='event_accept'),
    path('events/cancel/<slug:event_id>/', event.EventViewSet.cancel, name='event_cancel'),
    path('events/edit_basic_info/<slug:event_id>/', event.EventViewSet.edit_basic_info, name='edit_basic_info'),
    path('events/<slug:event_id>/download_quotation/', event.EventViewSet.download_quotation,
         name='download_quotation'),
    path('events/<slug:event_id>/upload_quotation/', event.EventViewSet.upload_quotation,
         name='upload_quotation'),
    path('events/update/', event.EventViewSet.update, name='event_update'),

    # EventTypes
    path('<slug:country_code>/event_types/', event_type.EventTypeViewSet.list_by_country, name='list_by_country'),
    path('event_types/<slug:event_type_id>/countries/', event_type.EventTypeViewSet.list_event_type_countries,
         name='list_event_type_countries'),
    path('event_types/<slug:event_type_id>/service_types/', event_type.EventTypeViewSet.list_event_type_service_types,
         name='list_event_type_service_types'),
    path('event_types/<slug:event_type_id>/events/', event_type.EventTypeViewSet.list_event_type_events,
         name='list_event_type_events'),
    # Services
    path('service_types/<slug:service_type_id>/services/', service_type.ServiceTypeViewSet.list_service_type_services,
         name='list_service_type_services'),
    path('<slug:country_code>/service_types/<slug:service_type_id>/services/',
         service_type.ServiceTypeViewSet.list_service_type_services_by_country,
         name='list_service_type_services_by_country'),
    path('<slug:country_code>/services/', service.ServiceViewSet.list_services_by_country,
         name='list_services_by_country'),
    # Curated events
    path('<slug:country_code>/curated_events/', curated_event.CuratedEventViewSet.list_by_country,
         name='list_curated_events_by_country'),
    # Upload
    path('upload/', upload.FileUploadView.as_view(), name='upload'),

    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
