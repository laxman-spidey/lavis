import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import ContactView from './contact/ContactView';
import ContactForm from './contact/ContactForm';
import { authRoles } from 'src/app/auth';

const ContactsApp = lazy(() => import('./ContactsApp'));

/**
 * The ContactsApp Route.
 */
const ContactsAppRoute: FuseRouteItemType = {
	path: 'appointments/doctors',
	element: <ContactsApp />,
	auth: authRoles.patient,
	children: [
		{
			path: ':id',
			element: <ContactView />
		},
		// {
		// 	path: ':id/edit',
		// 	element: <ContactForm />
		// }
	]
};

export default ContactsAppRoute;
