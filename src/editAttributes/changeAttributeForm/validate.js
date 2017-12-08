/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017 Amdocs
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 *
 * ECOMP is a trademark and service mark of AT&T Intellectual Property.
 */
import i18n from 'utils/i18n/i18n';

import {
  ERROR_MISSING_ATTR,
  ERROR_REQUIRED,
  NO_VALUE_SELECTED
} from './ChangeAttributeFormConstants.js';

const validate = (values) => {
  const errors = {};
  
  if (!values.uri || values.uri.replace(/\s/g, '') === '') {
    errors.uri = i18n(ERROR_REQUIRED);
  }
  if ((!values.provStatus || values.provStatus === NO_VALUE_SELECTED) &&
    (!values.inMaint || values.inMaint === NO_VALUE_SELECTED) &&
    (!values.isClosedLoopDisabled ||
    values.isClosedLoopDisabled ===
    NO_VALUE_SELECTED)) {
    errors.provStatus = i18n(ERROR_MISSING_ATTR);
  }
  
  return errors;
};

export default validate;
