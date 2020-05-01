import React, { useState, useEffect }from 'react';
import { useRouter, withRouter } from 'next/router';

import {
  Col,
  Button,
  Card,
  CardTitle,
  CardText,
  CardFooter,
  CardBody,
  CardHeader
} from 'reactstrap';

import moment from 'moment-timezone';
import StatusBar from '../StatusBar';

const EventCard = ({ name, eventDate, attendees, date, status, eventId, phoneNumber, type }) => {
  const router = useRouter();

  const onCardClicked = () => {
    router.push(`/event/${eventId}`)
  }
  
  return (
    <Col xs={12} md={4} className="mt-4">
      <Card outline onClick={onCardClicked}>
        <CardHeader tag="h5">{name}</CardHeader>
        <CardBody>
          <CardText>Event Date: <b>{moment(eventDate).tz('Asia/Singapore').format('DD/MM/YYYY hh:mm a')}</b></CardText>
          <CardText>Event Type: <b>{type.name}</b></CardText>
          <CardText>Attendees: <b>{attendees}</b></CardText>
          <CardText>Contact: {phoneNumber}</CardText>
          <CardText>Date Applied: {moment(date).tz('Asia/Singapore').format('DD/MM/YYYY hh:mm a')}</CardText>
          <StatusBar status={status}/>
        </CardBody>
      </Card>
      <style global jsx>{`
        .card:hover {
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
      `}</style>
    </Col>
  );
};


export default EventCard;
