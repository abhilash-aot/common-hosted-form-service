import { appAxios } from '@/services/interceptors';
import { ApiRoutes } from '@/utils/constants';

export default {
  //
  // Form Designer calls
  //

  /**
   * @function createSubmission
   * Submit the form data
   * @param {string} formId The form uuid
   * @param {string} versionId The form uuid
   * @param {Object} submissionData The form data for the submission
   * @returns {Promise} An axios response
   */
  createSubmission(formId, versionId, submissionData) {
    return appAxios().post(`${ApiRoutes.FORMS}/${formId}/versions/${versionId}/submissions`, submissionData);
  },

  /**
   * @function readForm
   * Get the baseline form metadata
   * @param {string} formId The form uuid
   * @returns {Promise} An axios response
   */
  readForm(formId) {
    return appAxios().get(`${ApiRoutes.FORMS}/${formId}`);
  },

  /**
   * @function readVersion
   * Get a specific form version schema
   * @param {string} formId The form uuid
   * @param {string} formVersionId The form version uuid
   * @returns {Promise} An axios response
   */
  readVersion(formId, formVersionId) {
    return appAxios().get(`${ApiRoutes.FORMS}/${formId}/versions/${formVersionId}`);
  },

  /**
   * @function readVersion
   * Updates a specific form version schema
   * @param {string} formId The form uuid
   * @param {string} formVersionId The form version uuid
   * @param {Object} data An object containing an updated schema object attribute
   * @returns {Promise} An axios response
   */
  updateVersion(formId, formVersionId, data) {
    return appAxios().put(`${ApiRoutes.FORMS}/${formId}/versions/${formVersionId}`, data);
  },

  /**
   * @function listSubmissions
   * Get the submissions for a form
   * @param {string} formId The form uuid
   * @returns {Promise} An axios response
   */
  listSubmissions(formId) {
    return appAxios().get(`${ApiRoutes.FORMS}/${formId}/submissions`);
  },
};
