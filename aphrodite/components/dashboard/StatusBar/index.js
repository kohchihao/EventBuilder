import React, { useState, useEffect } from 'react';

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

const StatusBar = ({ status }) => {
  const [color, setColor] = useState('secondary');
  const [statusName, setStatusName] = useState('PENDING');

  const setColorAndStatus = () => {
    switch (status) {
      case 'PENDING':
        setColor('secondary');
        setStatusName('Pending');
        break;
      case 'CONTACTED':
        setColor('primary');
        setStatusName('Contacted');
        break;
      case 'QUOTED':
        setColor('warning');
        setStatusName('Quoted');
        break;
      case 'ACCEPTED':
        setColor('success');
        setStatusName('Accepted');
        break;
      case 'CANCELLED':
        setColor('danger');
        setStatusName('Cancelled');
        break;
      default:
        setColor('secondary');
        setStatusName('Pending');
        break;
    }
  };
  useEffect(() => {
    setColorAndStatus();
  }, [status]);

  return (
    <Button color={color} className="w-100" disabled>
      Status: {statusName}
    </Button>
  );
};

export default StatusBar;
