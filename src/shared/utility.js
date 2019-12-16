export const updateObject = (oldObject, updatedValues) => {
  return {
    ...oldObject,
    ...updatedValues
  }
}

export const validateInput = (form, el) => {
  const elValue = form[el].value.toString()
  const elType = form[el].elementConfig.type
  const rules = form[el].validation
  let isValid = 'Valid'
  let errorMsg = ''

  // Required validation
  if (rules.required) {
    if (!elValue) {
      isValid = 'Invalid'
      errorMsg = 'This field is required'
    } else {
      isValid = 'Valid'
    }
  }

  // Length validation
  let lengthValid = true
  if (rules.length && elValue) {
    lengthValid = elValue.length === rules.length && lengthValid
    if (elValue.length !== rules.length) {
      errorMsg = 'This field must contain ' + (rules.length > 1 ? rules.length + ' digits' : 'one digit')
    }
  }

  // String validation
  if (elType === 'text' && elValue.length) {
    if(rules.type === 'alphanumeric') {
      if (elValue.match(/^[A-Za-z\u0600-\u06FF\u0750-\u077F()0-9\s]+$/)) {
        isValid = 'Valid'
      } else {
        isValid = 'Invalid'
        errorMsg = 'This field may contain letters, parentheses (), and numbers only'
      }
    } else if (elValue.match(/^[A-Za-z\u0600-\u06FF\u0750-\u077F\s]+$/)) {
      isValid = 'Valid'
    } else {
      isValid = 'Invalid'
      errorMsg = 'This field may contain letters only'
    }
  }

  // Number only validation
  if (elType === 'number' && elValue.length) {
    if (elValue.match(/^[0-9]+$/)) {
      isValid = 'Valid'
    } else {
      isValid = 'Invalid'
      errorMsg = 'This field may contain numbers only'
    }
  }

  // Email validation
  if (elType === 'email') {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(elValue)) {
      isValid = 'Valid'
    } else {
      isValid = 'Invalid'
      errorMsg = 'Please enter a valid email address'
    }
  }

  isValid = lengthValid ? isValid : 'Invalid'

  const validatedEl = {
    ...form[el],
    isValid: isValid,
    errorMsg: errorMsg
  }
  return validatedEl
}

export const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes.toString() : minutes.toString();
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export const getWeekDay = (weekDay) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return weekDays[weekDay]
}