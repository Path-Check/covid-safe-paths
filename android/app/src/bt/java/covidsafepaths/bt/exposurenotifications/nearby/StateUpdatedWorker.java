/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package covidsafepaths.bt.exposurenotifications.nearby;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Data;
import androidx.work.ListenableWorker;
import androidx.work.WorkerParameters;

import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import com.google.common.util.concurrent.FluentFuture;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import covidsafepaths.bt.exposurenotifications.common.AppExecutors;
import covidsafepaths.bt.exposurenotifications.common.TaskToFutureAdapter;
import covidsafepaths.bt.exposurenotifications.storage.TokenEntity;
import covidsafepaths.bt.exposurenotifications.storage.TokenRepository;

import static covidsafepaths.bt.exposurenotifications.nearby.ProvideDiagnosisKeysWorker.DEFAULT_API_TIMEOUT;

/**
 * Performs work for {@value com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient#ACTION_EXPOSURE_STATE_UPDATED}
 * broadcast from exposure notification API.
 */
public class StateUpdatedWorker extends ListenableWorker {

    private static final String TAG = "StateUpdatedWorker";
    // Added to tag the result of the work so that we can handle it at the JS layer.
    public static final String IS_EXPOSED_KEY = "IsExposed";

//  private static final String EXPOSURE_NOTIFICATION_CHANNEL_ID =
//      "ApolloExposureNotificationCallback.EXPOSURE_NOTIFICATION_CHANNEL_ID";
//  public static final String ACTION_LAUNCH_FROM_EXPOSURE_NOTIFICATION =
//      "com.google.android.apps.exposurenotification.ACTION_LAUNCH_FROM_EXPOSURE_NOTIFICATION";

    private final Context context;
    private final TokenRepository tokenRepository;

    public StateUpdatedWorker(
            @NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.context = context;
        this.tokenRepository = new TokenRepository(context);
    }

    @NonNull
    @Override
    public ListenableFuture<Result> startWork() {
        final String token = getInputData().getString(ExposureNotificationClient.EXTRA_TOKEN);
        if (token == null) {
            return Futures.immediateFuture(Result.failure());
        } else {
            AtomicBoolean isExposed = new AtomicBoolean(false);
            return FluentFuture.from(TaskToFutureAdapter.getFutureWithTimeout(
                    Nearby.getExposureNotificationClient(context).getExposureSummary(token),
                    DEFAULT_API_TIMEOUT.toMillis(),
                    TimeUnit.MILLISECONDS,
                    AppExecutors.getScheduledExecutor()))
                    .transformAsync((exposureSummary) -> {
                        Log.d(TAG, "EN summary received: " + exposureSummary);
                        if (exposureSummary.getMatchedKeyCount() > 0) {
                            isExposed.set(true);
                            // Update the TokenEntity by upserting with the same token.
                            return tokenRepository.upsertAsync(TokenEntity.create(token, true));
                        } else {
                            // No matches so we show no notification and just delete the token.
                            return tokenRepository.deleteByTokensAsync(token);
                        }
                    }, AppExecutors.getBackgroundExecutor())
                    .transform((v) -> {
                        // Added output data to surface the result of the check for matches.
                        Data out = new Data.Builder().putBoolean(IS_EXPOSED_KEY, isExposed.get()).build();
                        return Result.success(out);
                    }, AppExecutors.getLightweightExecutor())
                    .catching(Exception.class, x -> Result.failure(), AppExecutors.getLightweightExecutor());
        }
    }

    // TODO do we want to use native push notifications if app is in background?
//  private void createNotificationChannel() {
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//      NotificationChannel channel =
//          new NotificationChannel(EXPOSURE_NOTIFICATION_CHANNEL_ID,
//              context.getString(R.string.notification_channel_name),
//              NotificationManager.IMPORTANCE_HIGH);
//      channel.setDescription(context.getString(R.string.notification_channel_description));
//      NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
//      Objects.requireNonNull(notificationManager).createNotificationChannel(channel);
//    }
//  }
//
//  public void showNotification() {
//    createNotificationChannel();
//    Intent intent = new Intent(getApplicationContext(), ExposureNotificationActivity.class);
//    intent.setAction(ACTION_LAUNCH_FROM_EXPOSURE_NOTIFICATION);
//    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
//    PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);
//    NotificationCompat.Builder builder =
//        new Builder(context, EXPOSURE_NOTIFICATION_CHANNEL_ID)
//            .setSmallIcon(R.drawable.ic_notification)
//            .setColor(getApplicationContext().getResources().getColor(R.color.notification_color))
//            .setContentTitle(context.getString(R.string.notification_title))
//            .setContentText(context.getString(R.string.notification_message))
//            .setStyle(new NotificationCompat.BigTextStyle()
//                .bigText(context.getString(R.string.notification_message)))
//            .setPriority(NotificationCompat.PRIORITY_MAX)
//            .setContentIntent(pendingIntent)
//            .setOnlyAlertOnce(true)
//            .setAutoCancel(true)
//            // Do not reveal this notification on a secure lockscreen.
//            .setVisibility(NotificationCompat.VISIBILITY_SECRET);
//    NotificationManagerCompat notificationManager = NotificationManagerCompat
//        .from(context);
//    notificationManager.notify(0, builder.build());
//  }
}
