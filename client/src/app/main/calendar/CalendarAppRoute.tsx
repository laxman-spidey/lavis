import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';

const CalendarApp = lazy(() => import('./CalendarApp'));

/**
 * The Calendar App Route.
 */
const CalendarAppRoute: FuseRouteItemType = {
	path: 'appointments/schedule',
	element: <CalendarApp />,
	auth: authRoles.patient
	
};

export default CalendarAppRoute;
