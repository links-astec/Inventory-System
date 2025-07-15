from .models import Product, StockLog, Transaction
from django.db import transaction as db_transaction
from .notifications import notify_user


LOW_STOCK_THRESHOLD = 5


def adjust_product_stock(product, change_amount, change_type, user, note=""):
    """
    Adjusts stock quantity of a product and logs the change.
    """
    product.quantity += change_amount
    product.save()

    StockLog.objects.create(
        user=user,
        product=product,
        change_type=change_type,
        quantity_changed=change_amount,
        note=note
    )

    if product.quantity <= LOW_STOCK_THRESHOLD:
        notify_user(user, f"Warning: '{product.name}' stock is low ({product.quantity} left).")


@db_transaction.atomic
def record_transaction(buyer, product, quantity_sold, price_per_item, user):
    """
    Handles product sale:
    - Records transaction.
    - Reduces stock.
    - Logs stock deduction.
    - Sends notification if stock is low.
    """
    if quantity_sold > product.quantity:
        raise ValueError("Insufficient stock.")

    transaction = Transaction.objects.create(
        user=user,
        buyer=buyer,
        product=product,
        quantity_sold=quantity_sold,
        price_per_item=price_per_item
    )

    adjust_product_stock(
        product=product,
        change_amount=-quantity_sold,
        change_type="DECREASE",
        user=user,
        note=f"Sale to {buyer.name}"
    )

    return transaction
