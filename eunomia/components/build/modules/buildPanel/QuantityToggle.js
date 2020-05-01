import React, {useState, useRef, useImperativeHandle, forwardRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles, Input, InputAdornment, FormControl, FormHelperText} from "@material-ui/core";
import {getQuantityOrdered, getUnitOfService} from "../../selectors";
import {changeServiceQuantity} from "../../action";

const useStyles = makeStyles(() => ({
  root: {
    textAlign: "center",
  },
  iconWrapper: {
    borderRadius: "50%",
    textAlign: "center",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto"
  },
  icon: {
    fontSize: 30,
  },
  quantity: {
    display: "inline-block",
    maxWidth: 200,
  },
  unit: {
    width: 100,
    justifyContent: "flex-end"
  }
}));

const QuantityToggle = (props, ref) => {
  const {service} = props;
  const classes = useStyles();
  const orderQuantity = useSelector((state) => getQuantityOrdered(state, service.id));
  const unit = useSelector((state) => getUnitOfService(state, service.id));
  const dispatch = useDispatch();
  const toggleFieldRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      toggleFieldRef.current.focus()
    }
  }), [orderQuantity]);

  const changeQuantity = (quantity) => {
    if (quantity === orderQuantity) {
      return;
    }

    if (isInvalidQuantity(quantity)) {
      setError(true);
    } else {
      setError(false)
    }
    dispatch(changeServiceQuantity(service.id, quantity));
  };

  const isInvalidQuantity = (quantity) => {
    return (service.minQuantity && service.minQuantity > quantity) ||
      (service.maxQuantity && service.maxQuantity < quantity)
  };

  const [error, setError] = useState(isInvalidQuantity(orderQuantity));
  return (
    <div className={classes.root}>
      <div className={classes.quantity}>
        <FormControl error={!!error}>
          <Input
            value={orderQuantity}
            onChange={(e) => changeQuantity(e.target.value.replace(/\D/g, "")
              .substr(0, 9))}
            type="tel"
            inputRef={toggleFieldRef}
            endAdornment={<InputAdornment className={classes.unit} position="end">{unit}</InputAdornment>}
          />
          <FormHelperText>
            <span style={{float: "left"}}>
              Min: {service.minQuantity}
            </span>
            {service.maxQuantity && (
              <span style={{float: "right"}}>
                Max: {service.maxQuantity}
              </span>
            )}
          </FormHelperText>
        </FormControl>
      </div>
    </div>
  )
};

export default forwardRef(QuantityToggle)
