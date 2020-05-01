from google.cloud import storage
import six


def upload_file(file, filename, content_type, bucket_name='eventbuilder-media'):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(filename)

    blob.upload_from_file(
        file,
        content_type=content_type)

    url = blob.public_url
    if isinstance(url, six.binary_type):
        url = url.decode('utf-8')
    return url


def upload_quotation(file, filename):
    client = storage.Client()
    bucket = client.get_bucket('buildevent-quotations')
    blob = bucket.blob(filename)
    blob.upload_from_file(file, content_type="application/pdf")


def download_quotation(source_blob_name, output_file):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket('buildevent-quotations')
    blob = bucket.blob(source_blob_name)
    blob.download_to_file(output_file)
