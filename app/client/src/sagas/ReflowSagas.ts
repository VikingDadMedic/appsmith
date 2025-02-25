import {
  setEnableReflowAction,
  updateReflowOnBoardingAction,
} from "actions/reflowActions";
import {
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
  ReflowReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import { User } from "constants/userConstants";
import { isBoolean } from "lodash";
import { all, put, select, takeLatest, take } from "redux-saga/effects";
import { getCurrentUser } from "selectors/usersSelectors";
import {
  getReflowBetaFlag,
  getReflowOnBoardingFlag,
  setReflowOnBoardingFlag,
  setReflowBetaFlag,
} from "utils/storage";

function* initReflowStates() {
  try {
    let user: User = yield select(getCurrentUser);
    if (!user) {
      const userFetched: ReduxAction<User> = yield take(
        ReduxActionTypes.FETCH_USER_DETAILS_SUCCESS,
      );
      user = userFetched.payload;
    }
    const { email } = user;
    if (email) {
      const enableReflow: boolean = yield getReflowBetaFlag(email);
      const enableReflowHasBeenSet = isBoolean(enableReflow);
      yield put(
        setEnableReflowAction(enableReflowHasBeenSet ? enableReflow : true),
      );
      if (!enableReflowHasBeenSet) {
        setReflowBetaFlag(email, true);
      }
      const isOnBoarded: boolean = yield getReflowOnBoardingFlag(email);
      yield put(
        updateReflowOnBoardingAction(
          isBoolean(isOnBoarded) ? isOnBoarded : false,
        ),
      );
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.REFLOW_BETA_FLAGS_INIT_ERROR,
      payload: {
        error,
      },
    });
  }
}

function* closeReflowOnboardingCard() {
  try {
    const user: User = yield select(getCurrentUser);
    const { email } = user;
    if (email) {
      yield setReflowOnBoardingFlag(email, true);
    }
    yield put(updateReflowOnBoardingAction(true));
  } catch (error) {
    yield put(updateReflowOnBoardingAction(true));
  }
}

export default function* reflowSagas() {
  yield all([
    takeLatest(ReduxActionTypes.INITIALIZE_EDITOR, initReflowStates),
    takeLatest(
      ReflowReduxActionTypes.CLOSE_ONBOARDING_CARD,
      closeReflowOnboardingCard,
    ),
  ]);
}
