import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Contact } from './ContactsApi';

type ContactListItemPropsType = {
	contact: Contact;
};

/**
 * The contact list item.
 */
function ContactListItem(props: ContactListItemPropsType) {
	const { contact } = props;

	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/appointments/doctors/${contact.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={contact.data.name}
						src={contact.data.photoURL}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={contact.data.displayName}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{contact.data.title}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ContactListItem;
