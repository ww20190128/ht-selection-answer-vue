
export function formatDate(value, args = 'yyyy-MM-dd HH:mm:ss') {
  const dt = new Date(value * 1000)
  let year
  let month
  let date
  let hour
  let minute
  let second
  switch (args) {
    case 'yyyy-M-d':
      year = dt.getFullYear()
      month = dt.getMonth() + 1
      date = dt.getDate()
      return `${year}-${month}-${date}`
    case 'yyyy-M-d H:m:s':
      year = dt.getFullYear()
      month = dt.getMonth() + 1
      date = dt.getDate()
      hour = dt.getHours().toString().padStart(2, '0')
      minute = dt.getMinutes()
      second = dt.getSeconds()
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`
    case 'yyyy-MM-dd':
      year = dt.getFullYear()
      month = (dt.getMonth() + 1).toString().padStart(2, '0')
      date = dt.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${date}`
    case 'mm:ss':
      year = dt.getFullYear()
      minute = dt.getMinutes().toString().padStart(2, '0')
      second = dt.getSeconds().toString().padStart(2, '0')
      return `${minute}:${second}`
    case 'yyyy-MM-dd HH:mm:ss':
      year = dt.getFullYear()
      month = (dt.getMonth() + 1).toString().padStart(2, '0')
      date = dt.getDate().toString().padStart(2, '0')
      hour = dt.getHours().toString().padStart(2, '0')
      minute = dt.getMinutes().toString().padStart(2, '0')
      second = dt.getSeconds().toString().padStart(2, '0')
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`
    case 'yyyy/MM/dd':
      year = dt.getFullYear()
      month = (dt.getMonth() + 1).toString().padStart(2, '0')
      date = dt.getDate().toString().padStart(2, '0')
      hour = dt.getHours().toString().padStart(2, '0')
      minute = dt.getMinutes().toString().padStart(2, '0')
      second = dt.getSeconds().toString().padStart(2, '0')
      return `${year}/${month}/${date}`
  }
}
