function handleValidationErrors(err, res, template, data) {

  res.render(template, { errors: err.errors, ...data });
  return;
} 
