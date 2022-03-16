from apscheduler.schedulers.blocking import BlockingScheduler


sched = BlockingScheduler()


# @sched.scheduled_job('interval', days=1)
# def timed_job():
#     from accounts.models import Account
#     accounts = list(Account.objects.all())
#     for x in range(0, len(accounts)):
#         points = x.points
#         points = points + 1000
#         x.points = points

@sched.scheduled_job('interval', minutes=1)
def timed_job():
    print('hi')


sched.start()
