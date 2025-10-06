import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  status: "active" | "archived";
  category: string;
}

interface Notification {
  id: string;
  message: string;
  type: "new" | "update";
  timestamp: string;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "Квартальные результаты Q3 2024",
      content: "Компания показала рост выручки на 23% по сравнению с прошлым кварталом. Команда продаж превысила план на 15%.",
      author: "Иван Петров",
      date: "2024-10-05",
      status: "active",
      category: "Корпоративные события"
    },
    {
      id: "2",
      title: "Новая корпоративная политика отпусков",
      content: "С 1 ноября вводятся изменения в порядок согласования отпусков. Подробности в прикрепленном документе.",
      author: "Мария Сидорова",
      date: "2024-10-04",
      status: "active",
      category: "Новые политики"
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", message: "Новая публикация: Квартальные результаты Q3 2024", type: "new", timestamp: "5 мин назад" },
    { id: "2", message: "Обновление: Новая корпоративная политика", type: "update", timestamp: "2 часа назад" }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: ""
  });

  const allCategories = Array.from(new Set(posts.map(p => p.category)));

  const handleCreatePost = () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Заполните все поля");
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      author: "Текущий пользователь",
      date: new Date().toISOString().split("T")[0],
      status: "active",
      category: formData.category
    };

    setPosts([newPost, ...posts]);
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: `Новая публикация: ${formData.title}`,
      type: "new",
      timestamp: "только что"
    };
    setNotifications([newNotification, ...notifications]);

    setFormData({ title: "", content: "", category: "" });
    setIsCreating(false);
    toast.success("Публикация создана");
  };

  const handleEditPost = () => {
    if (!editingPost || !formData.title || !formData.content || !formData.category) {
      toast.error("Заполните все поля");
      return;
    }

    setPosts(posts.map(p => 
      p.id === editingPost.id 
        ? { ...p, title: formData.title, content: formData.content, category: formData.category }
        : p
    ));

    const newNotification: Notification = {
      id: Date.now().toString(),
      message: `Обновление: ${formData.title}`,
      type: "update",
      timestamp: "только что"
    };
    setNotifications([newNotification, ...notifications]);

    setFormData({ title: "", content: "", category: "" });
    setEditingPost(null);
    toast.success("Публикация обновлена");
  };

  const handleArchive = (id: string) => {
    setPosts(posts.map(p => 
      p.id === id ? { ...p, status: p.status === "active" ? "archived" : "active" as "active" | "archived" } : p
    ));
    toast.success("Статус изменен");
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category
    });
  };

  const openCreateDialog = () => {
    setIsCreating(true);
    setFormData({ title: "", content: "", category: "" });
  };

  const filteredPosts = posts.filter(p => {
    const matchesStatus = filter === "all" || p.status === filter;
    const matchesSearch = 
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    
    return matchesStatus && matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-gradient-to-r from-[#003D7A] to-[#0066CC] text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Layers" size={32} className="text-white" />
              <h1 className="text-3xl font-bold">LYBLYKOTIKOV</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative hover:bg-white/10 text-white"
                >
                  <Icon name="Bell" size={24} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <Card className="absolute right-0 top-12 w-80 shadow-xl z-50 animate-slide-in">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">Уведомления</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setNotifications([])}
                          className="text-xs"
                        >
                          Очистить
                        </Button>
                      </div>
                      
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            Нет новых уведомлений
                          </p>
                        ) : (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              className="p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <Icon 
                                  name={notif.type === "new" ? "Plus" : "Edit"} 
                                  size={16} 
                                  className="text-primary mt-1" 
                                />
                                <div className="flex-1">
                                  <p className="text-sm">{notif.message}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notif.timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              <Button
                onClick={openCreateDialog}
                className="bg-white text-[#0066CC] hover:bg-blue-50"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Создать публикацию
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "cards" | "table")} className="mb-6">
          <TabsList>
            <TabsTrigger value="cards">
              <Icon name="Newspaper" size={16} className="mr-2" />
              Новости
            </TabsTrigger>
            <TabsTrigger value="table">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройка
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mb-6 space-y-4">
          <div className="relative max-w-xl">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по заголовку, содержанию или автору..."
              className="pl-10 h-12"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Категория:</span>
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              Все
            </Button>
            {allCategories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            Все
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
          >
            <Icon name="FileText" size={16} className="mr-2" />
            Активные
          </Button>
          <Button
            variant={filter === "archived" ? "default" : "outline"}
            onClick={() => setFilter("archived")}
          >
            <Icon name="Archive" size={16} className="mr-2" />
            Архив
          </Button>
        </div>

        {viewMode === "cards" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <Card 
              key={post.id} 
              className="p-6 hover:shadow-lg transition-shadow animate-fade-in"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge variant={post.status === "active" ? "default" : "secondary"}>
                  {post.category}
                </Badge>
                <Badge variant="outline">
                  {post.status === "active" ? "Активно" : "Архив"}
                </Badge>
              </div>

              <h2 className="text-xl font-semibold mb-3 text-[#003D7A]">
                {post.title}
              </h2>
              
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {post.content}
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Icon name="User" size={16} />
                <span>{post.author}</span>
                <span>•</span>
                <Icon name="Calendar" size={16} />
                <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(post)}
                  className="flex-1"
                >
                  <Icon name="Edit" size={16} className="mr-1" />
                  Редактировать
                </Button>
                <Button
                  variant={post.status === "active" ? "secondary" : "default"}
                  size="sm"
                  onClick={() => handleArchive(post.id)}
                  className="flex-1"
                >
                  <Icon name="Archive" size={16} className="mr-1" />
                  {post.status === "active" ? "Архивировать" : "Восстановить"}
                </Button>
              </div>
            </Card>
          ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Автор</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Нет публикаций
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map(post => (
                    <TableRow key={post.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="max-w-xs">
                          <div className="font-semibold text-[#003D7A]">{post.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {post.content}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.status === "active" ? "default" : "secondary"}>
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon name="User" size={14} className="text-muted-foreground" />
                          <span className="text-sm">{post.author}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={14} className="text-muted-foreground" />
                          <span className="text-sm">{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {post.status === "active" ? "Активно" : "Архив"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {post.id !== "2" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(post)}
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleArchive(post.id)}
                            >
                              <Icon name="Archive" size={16} />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        {filteredPosts.length === 0 && viewMode === "cards" && (
          <div className="text-center py-12">
            <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Нет публикаций</p>
          </div>
        )}
      </main>

      <Dialog open={isCreating || editingPost !== null} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setEditingPost(null);
          setFormData({ title: "", content: "", category: "" });
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Редактировать публикацию" : "Создать публикацию"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Заголовок</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Введите заголовок"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Категория</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Например: Изменение регламентов, Новые политики, Корпоративные события"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Содержание</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Введите текст публикации"
                rows={6}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setEditingPost(null);
                  setFormData({ title: "", content: "", category: "" });
                }}
              >
                Отмена
              </Button>
              <Button onClick={editingPost ? handleEditPost : handleCreatePost}>
                {editingPost ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;