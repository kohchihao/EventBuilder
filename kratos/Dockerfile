FROM python:3.7
ENV PYTHONUNBUFFERED 1
WORKDIR /root/kratos

COPY Pipfile* ./
RUN pip install pipenv
RUN pipenv install --system

CMD ./run
