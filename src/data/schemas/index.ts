import * as leads from './leads';
import * as leadServices from './lead_services';
import * as services from './services';

export default {
  ...leads,
  ...leadServices,
  ...services,
};
