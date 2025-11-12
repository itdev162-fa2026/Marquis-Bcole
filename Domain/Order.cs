using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
namespace Domain;

public enum OrderStatus
{
    Pending,
    Completed,
    Failed
}

public class Order
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    public string CustomerEmail { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public DateTime CreateDate { get; set; }

    public DateTime? CompletedDate { get; set; }

    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}