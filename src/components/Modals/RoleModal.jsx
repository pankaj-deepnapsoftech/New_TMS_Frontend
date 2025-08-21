import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const RoleSchema = Yup.object().shape({
  role: Yup.string().required('Role Name is required'),
  allowedPage: Yup.string().required('Please select a Page'),
});

export function RolesModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[600px] h-[350px] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Role</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{ role: '', allowedPage: '' }}
          validationSchema={RoleSchema}
          onSubmit={(values, { resetForm }) => {
            console.log('Form Data:', values);
            resetForm();
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Role Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Role Name</label>
                <Field type="text" name="roleName" placeholder="Enter role name" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <ErrorMessage name="roleName" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Select Tag */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select Pages</label>
                <Field as="select" name="tag" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Select Pages --</option>
                  <option value=""></option>
                  <option value=""></option>
                  <option value=""></option>
                  <option value=""></option>
                </Field>
                <ErrorMessage name="tag" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
