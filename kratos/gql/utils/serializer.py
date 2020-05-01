from django.db import transaction


def create_model_with_nesting(validated_data, model, model_name, nested_names, nested_models,
                              nested_model_validation=None):
    with transaction.atomic():
        nested_data_arr = [validated_data.pop(name) for name in nested_names]
        instance = model.objects.create(**validated_data)

        ctx = 0
        for nested_model in nested_models:
            nested_data = nested_data_arr[ctx]
            for data in nested_data:
                nested_instance = nested_model.objects.create(**{model_name: instance}, **data)
                if nested_model_validation and len(nested_model_validation) == len(nested_models) \
                        and nested_model_validation[ctx]:
                    nested_model_validation[ctx](nested_instance)
            ctx += 1
    return instance


def update_model_with_nesting(instance, validated_data, model_name, nested_names, nested_models,
                              nested_model_validation=None):
    with transaction.atomic():
        # Update the instance
        nested_data_arr = [validated_data.pop(name) for name in nested_names]
        [setattr(instance, field, validated_data[field]) for field in validated_data]
        instance.save()

        # Delete any structures not included in the request
        ctx = 0
        for nested_data in nested_data_arr:
            data_ids = []
            for data in nested_data:
                if 'id' in data.keys():
                    data_ids.append(data['id'])
            for nested_instance in nested_models[ctx].objects.filter(**{model_name: instance}).all():
                if nested_instance.id not in data_ids:
                    nested_instance.delete()
            ctx += 1

        # Create or update structure instances that are in the request
        ctx = 0
        for nested_data in nested_data_arr:
            for data in nested_data:
                updated_nested_instance = nested_models[ctx](**{model_name: instance}, **data)
                updated_nested_instance.save()
                if nested_model_validation and len(nested_model_validation) == len(nested_models) \
                        and nested_model_validation[ctx]:
                    nested_model_validation[ctx](updated_nested_instance)
            ctx += 1

    return instance
