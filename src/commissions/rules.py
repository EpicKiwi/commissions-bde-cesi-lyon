import rules


@rules.predicate
def is_active_commission(user, commission):
	if commission is None:
		return True

	return commission.is_active


@rules.predicate
def is_commission_team_member(user, commission):
	if commission is None:
		return True

	return ((
					user.get_username() == commission.president.get_username()
			) or (
					user.get_username() == commission.treasurer.get_username()
			) or (
					commission.deputy is not None and user.get_username() == commission.deputy.get_username()
			))


@rules.predicate
def is_commission_president(user, commission):
	if commission is None:
		return True

	return user.get_username() == commission.president.get_username()